import io

from django.contrib.auth.models import User
from django.db import models
from django.core.files.base import ContentFile
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone

from sitemanagement.constants.image_save_path import qr_upload_path, car_image_upload_path
from sitemanagement.constants.account_types import account_types

from api.utils.generate_qrcode import generate_qrcode
from api.utils.prefix_transliteration import transliterate_to_latin

from dictionaries.models import Brand, Model, BodyType, Colors

class Partner(models.Model):
    partner_name = models.CharField(max_length=255, verbose_name="Название компании партнера")
    partner_prefix = models.CharField(max_length=2, verbose_name="Префикс для QR кода", editable=False, blank=True)
    
    class Meta:
        verbose_name = "Партнер"
        verbose_name_plural = "Партнеры"
    
    def __str__(self):
        return f"{self.partner_name} ({self.partner_prefix})"
    
    def save(self, *args, **kwargs):
        if not self.partner_prefix:
            # транслитерируем название
            transliterated = transliterate_to_latin(self.partner_name)
            
            # берем только буквы
            letters = [char for char in transliterated if char.isalpha()]
            
            if len(letters) == 0:
                self.partner_prefix = 'XX'
            elif len(letters) == 1:
                self.partner_prefix = letters[0].upper() * 2
            else:
                first_letter = letters[0].upper()
                
                # пробуем разные комбинации пока не найдем уникальную
                for i in range(1, min(len(letters), 5)):  # пробуем до 5 буквы
                    candidate = first_letter + letters[i].upper()
                    
                    # проверяем, есть ли уже такой префикс
                    exists = Partner.objects.filter(
                        partner_prefix=candidate
                    ).exclude(
                        pk=self.pk if self.pk else None
                    ).exists()
                    
                    if not exists:
                        self.partner_prefix = candidate
                        break
                else:
                    # если все комбинации заняты, используем первую+последнюю букву
                    self.partner_prefix = first_letter + letters[-1].upper()
        super().save(*args, **kwargs)

class QRCode(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(
    User,
    on_delete=models.CASCADE,
    verbose_name="Пользователь",
    null=True,
    blank=True
    )
    partner = models.ForeignKey(
        Partner,
        on_delete=models.PROTECT,
        verbose_name='Партнер',
        help_text='Партнер для использования префикса в QR коде'
    )
    code = models.CharField(max_length=255, verbose_name="Код", unique=True)
    image = models.ImageField(upload_to=qr_upload_path, verbose_name="Фото QR кода")
    status = models.CharField(max_length=15, choices=[('active', 'Активен'), ('deactivated', 'Деактивирован по таймеру')], default='active', verbose_name="Статус активности")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    account_type = models.CharField(
        max_length=1, 
        choices=[('L', 'Light'), ('M', 'Medium'), ('P', 'Premium')], 
        default='L',
        verbose_name='Тарифный план',
        help_text='Тип тарифного плана (L/M/P) - влияет на генерацию кода'
    )
    
    is_printed = models.BooleanField(default=False, verbose_name="Статус распечатки")       # отправлен в типографию
    is_printed_timestamp = models.DateTimeField(null=True, blank=True, verbose_name="Дата распечатки")
    
    is_deployed = models.BooleanField(default=False, verbose_name="Отгружено партнеру")     # отгружено партнерам для распространения
    is_deployed_timestamp = models.DateTimeField(null=True, blank=True, verbose_name="Дата отгрузки")
    
    is_selled = models.BooleanField(default=False, verbose_name="Статус реализации партнером")      # продан ли QR партнером?
    selled_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        related_name='sold_qrcodes',
        limit_choices_to={'is_staff': True},
        null=True,
        blank=True,
        verbose_name="Продано менеджером"
    )
    is_selled_timestamp = models.DateTimeField(null=True, blank=True, verbose_name="Дата реализации")
    
    is_active = models.BooleanField(default=False, verbose_name="Статус активации клиентом")    # активирован ли QR клиентом?
    is_active_timestamp = models.DateTimeField(null=True, blank=True, verbose_name="Дата активации")
    active_before = models.DateTimeField(null=True, blank=True, verbose_name="Таймер деактивации")      # если пользователь не активировал QR код за 60 дней, то его нужно деактивировать
    
    class Meta:
        verbose_name = "QR код"
        verbose_name_plural = "QR коды"

    def __str__(self):
        return self.code


    def save(self, *args, **kwargs):
        if not self.pk:  # только при создании
            # проверяем наличие обязательных полей
            if not self.partner:
                raise ValueError("Необходимо выбрать партнера для генерации QR кода")
            if not self.account_type:
                raise ValueError("Необходимо выбрать тип аккаунта для генерации QR кода")
            
            # генерируем QR код с префиксом партнера и типом аккаунта
            qr_image, _, unique_code = generate_qrcode(
                partner_prefix=self.partner.partner_prefix,
                account_type=self.account_type
            )
            self.code = unique_code

            # сохраняем изображение во временный буфер
            image_io = io.BytesIO()
            qr_image.save(image_io, format="PNG")
            self.image.save(f"{unique_code}.png", ContentFile(image_io.getvalue()), save=False)
            
        super().save(*args, **kwargs)

class Car(models.Model):
    id = models.AutoField(primary_key=True)
    vin_code = models.CharField(max_length=17, verbose_name='VIN код автомобиля')
    qr_code = models.OneToOneField(
        QRCode,  
        on_delete=models.PROTECT,
        verbose_name='QR код автомобиля',
        related_name='car_instance',
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name="Пользователь",
    )
    brand = models.ForeignKey(
        Brand,
        on_delete=models.PROTECT,
        verbose_name="Марка автомобиля клиента"
    )
    model = models.ForeignKey(
        Model,
        on_delete=models.PROTECT,
        verbose_name="Модель автомобиля клиента"
    )
    body_type = models.ForeignKey(
        BodyType,
        on_delete=models.PROTECT,
        verbose_name="Кузов автомобиля клиента"
    )
    year_built = models.PositiveIntegerField(
    verbose_name="Год выпуска",
    validators=[
        MinValueValidator(1980),
        MaxValueValidator(timezone.now().year)
    ])
    color = models.ForeignKey(
        Colors,
        on_delete=models.PROTECT,
        verbose_name="Цвет автомобиля клиента"
    )
    lising_company = models.ForeignKey(
        Partner,
        on_delete=models.PROTECT,
        verbose_name="Лизинговая компания"
    )
    image = models.ImageField(
        upload_to=car_image_upload_path,
        verbose_name="Фото пользователя",
        null=True,
        blank=True
    )
    licence_plate = models.CharField(max_length=15, verbose_name="Номерной знак авто")
    
    class Meta:
        verbose_name = "Автомобиль"
        verbose_name_plural = "Автомобили"
    
    def __str__(self):
        return f"{self.licence_plate} - {self.qr_code.code}"
        
class Membership(models.Model):
    id = models.AutoField(primary_key=True)
    plan = models.CharField(max_length=10, choices=account_types, verbose_name='Название тарифного плана')
    price = models.IntegerField(verbose_name='Стоимость тарифного плана / месяц', null=True, blank=True)
    is_recommended = models.BooleanField(default=False, verbose_name='Рекомендуемость')
    features = models.ManyToManyField('Feature', related_name='membership_plans', verbose_name='Свойства')
    class Meta:
        verbose_name = 'Тарифный план'
        verbose_name_plural = 'Тарифные планы'
        ordering = ['id']
        
    def __str__(self):
        return self.plan
    
class Feature(models.Model):
    name = models.CharField(max_length=255, verbose_name='Название свойства')
    
    class Meta:
        verbose_name = 'Свойство'
        verbose_name_plural = 'Свойства'
        
    def __str__(self):
        return self.name
    
class FAQ (models.Model):
    title = models.CharField(max_length=250)
    content = models.CharField(max_length=800)
    
    class Meta:
        verbose_name = 'FAQ'
        verbose_name_plural = 'FAQs'
        ordering = ['id']

    def __str__(self):
        return self.title
    
class Leads(models.Model):
    phone_number = models.CharField(max_length=17)
    
    class Meta:
        verbose_name = 'Лид на главной'
        verbose_name_plural = 'Лиды на главной'
    def __str__(self):
        return self.phone_number