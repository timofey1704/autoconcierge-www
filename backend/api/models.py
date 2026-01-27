import uuid
from django.contrib.auth.models import User
from django.db import models
from django.core.exceptions import ValidationError

from sitemanagement.constants.account_types import account_types, manager_account_types
from sitemanagement.constants.image_save_path import user_image_upload_path
from sitemanagement.models import Partner

from dictionaries.models import Cities

USER_TYPE_CHOICES = [
    ('client', 'Клиент'),
    ('manager', 'Менеджер'),
]

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='userprofile')
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, null=True)
    phone_number = models.CharField(max_length=18, unique=True, verbose_name="Номер телефона")
    user_type = models.CharField(
        max_length=10,
        choices=USER_TYPE_CHOICES,
        default='client',
        verbose_name="Тип пользователя"
    )
    client_account_type = models.CharField(
        max_length=20,
        verbose_name="Тип аккаунта (для клиентов)",
        choices=account_types,
        blank=True,
        null=True
    )
    manager_account_type = models.CharField(
        max_length=50,
        verbose_name="Тип аккаунта (для менеджеров)",
        choices=manager_account_types,
        blank=True,
        null=True
    )
    partner = models.ForeignKey(
        Partner,
        on_delete=models.PROTECT,
        verbose_name='Партнер',
        help_text='Компания, в которой работает менеджер',
        null=True,
        blank=True
    )
    patronymic = models.CharField(max_length=30, verbose_name="Отчество", null=True, blank=True)
    city = models.ForeignKey(Cities, on_delete=models.PROTECT, verbose_name="Город проживания", null=True, blank=True)
    address = models.CharField(max_length=255, verbose_name="Адрес", null=True, blank=True)
    privacy_accepted = models.BooleanField(default=False, verbose_name="Принятие политики конфиденциальности")
    image = models.ImageField(
        upload_to=user_image_upload_path,
        verbose_name="Фото пользователя",
        null=True,
        blank=True
    )
    telegram_id = models.CharField(max_length=255, null=True, blank=True, verbose_name="Telegram ID клиента")
    department = models.CharField(max_length=255, null=True, blank=True, verbose_name="Отдел")
    
    class Meta:
        verbose_name = "Профиль пользователя"
        verbose_name_plural = "Профили пользователей"
   
    def __str__(self):
        user_type_display = dict(USER_TYPE_CHOICES).get(self.user_type, self.user_type)
        return f"{self.phone_number} ({user_type_display})"
    
    @property
    def account_type(self):
        """Возвращает актуальный тип аккаунта в зависимости от user_type"""
        if self.user_type == 'manager':
            return self.manager_account_type
        return self.client_account_type
    
    def clean(self):
        """Валидация: проверяем, что заполнено нужное поле"""
        super().clean()
        
        if self.user_type == 'client':
            if not self.client_account_type:
                raise ValidationError({
                    'client_account_type': 'Это поле обязательно для клиентов'
                })
            # очищаем manager поля
            self.manager_account_type = None
            self.partner = None
        
        if self.user_type == 'manager':
            if not self.manager_account_type:
                raise ValidationError({
                    'manager_account_type': 'Это поле обязательно для менеджеров'
                })
            
            if not self.partner:
                raise ValidationError({
                    'partner': 'Это поле обязательно для менеджеров'
                })
            # очищаем client поле
            self.client_account_type = None
    
    def save(self, *args, **kwargs):
        # вызываем full_clean для валидации
        self.full_clean()
        super().save(*args, **kwargs)
    
    @property
    def is_manager(self):
        return self.user_type == 'manager'
    
    @property
    def is_client(self):
        return self.user_type == 'client'