import uuid
from django.contrib.auth.models import User
from django.db import models

from sitemanagement.constants.account_types import account_types
from sitemanagement.constants.image_save_path import user_image_upload_path

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, null=True)
    phone_number = models.CharField(max_length=18, unique=True, verbose_name="Номер телефона")
    account_type = models.CharField(max_length=20, verbose_name="Тип аккаунта", choices=account_types)
    privacy_accepted = models.BooleanField(default=False, verbose_name="Принятие политики конфиденциальности")
    image = models.ImageField(
        upload_to=user_image_upload_path,
        verbose_name="Фото пользователя",
        null=True,
        blank=True
    )
   
    def __str__(self):
        return str(self.phone_number)