from django.db import models

class Cities(models.Model):
    name = models.CharField(max_length=255, verbose_name='Название города')
    country = models.CharField(max_length=255, verbose_name='Страна')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    
    class Meta:
        verbose_name = 'Город'
        verbose_name_plural = 'Города'
        
    def __str__(self):
        return self.name
    
class Colors(models.Model):
    name = models.CharField(max_length=255, verbose_name='Название цвета')
    hex_code = models.CharField(max_length=255, verbose_name='HEX код цвета')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    
    class Meta:
        verbose_name = 'Цвет автомобиля'
        verbose_name_plural = 'Цвета автомобилей'
        
    def __str__(self):
        return self.name

class Brand(models.Model):
    name = models.CharField(max_length=50, verbose_name="Название марки", help_text="например: BMW")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    
    class Meta:
        verbose_name = 'Бренд автомобиля'
        verbose_name_plural = 'Бренды автомобилей'
        
    def __str__(self):
        return self.name
    
class Model(models.Model):
    name = models.CharField(max_length=50, verbose_name="Название модели", help_text="например: 5-series")
    brand = models.ForeignKey(
        Brand,
        on_delete=models.CASCADE,
        verbose_name="Производитель",
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    
    class Meta:
        verbose_name = 'Модель автомобиля'
        verbose_name_plural = 'Модели автомобилей'
        
    def __str__(self):
        return f"{self.name} - {self.brand}"
    
class BodyType (models.Model):
    name = models.CharField(max_length=50, verbose_name="Название кузова", help_text="например: F30")
    model = models.ForeignKey(
        Model,
        on_delete=models.CASCADE,
        verbose_name="Модель",
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')  

    class Meta:
        verbose_name = 'Кузов автомобиля'
        verbose_name_plural = 'Кузова автомобилей'
        
    def __str__(self):
        return f"{self.name} - {self.model}"
