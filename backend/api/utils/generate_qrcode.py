import qrcode
from qrcode import constants
from django.conf import settings
import io
import base64
import random
import string
from typing import Tuple
from PIL import Image as PILImage
from django.apps import apps

redirect_url = settings.ACTIVATION_URL

def get_qr_model():
    """
    Получает модель QRCode используя apps.get_model() для избежания циклического импорта
    """
    return apps.get_model('sitemanagement', 'QRCode')

def generate_unique_qr_code(partner_prefix: str, account_type: str) -> str:
    """
    Генерирует уникальный 8-символьный код для QR.
    Формат: [2 буквы префикса партнера][1 буква тарифа][5 случайных цифр]
    Пример: ABL12345
    
    Args:
        partner_prefix: Двухбуквенный префикс партнера (например, 'AB')
        account_type: Тип тарифного плана ('L', 'M', или 'P')
    
    Returns:
        Уникальная строка длиной 8 символов
    """
    # проверяем корректность входных данных
    if len(partner_prefix) != 2:
        raise ValueError(f"Префикс партнера должен быть длиной 2 символа, получено: {partner_prefix}")
    if account_type not in ['L', 'M', 'P']:
        raise ValueError(f"Тип аккаунта должен быть L, M или P, получено: {account_type}")
    
    # формируем базу кода из префикса партнера и типа аккаунта
    code_base = partner_prefix.upper() + account_type.upper()
    
    # определяем допустимые символы: A-Z и 1-9
    letters = string.ascii_uppercase.replace('O', '') #fix - remove letter O
    digits = '123456789'
    all_chars = letters + digits
    
    while True:
        # генерируем 5 случайных цифр
        random_digits = ''.join(random.choice(all_chars) for _ in range(5))
        
        # формируем полный код
        code = code_base + random_digits
        
        # проверяем код на уникальность
        if not get_qr_model().objects.filter(code=code).exists():
            return code


def generate_qrcode(partner_prefix: str, account_type: str, base_url: str = redirect_url) -> Tuple[PILImage.Image, str, str]:
    """
    Генерация QR кода для страницы регистрации с уникальным параметром.

    Args:
        partner_prefix: Двухбуквенный префикс партнера (например, 'AB')
        account_type: Тип тарифного плана ('L', 'M', или 'P')
        base_url: Базовый URL для регистрации (по умолчанию redirect_url)

    Returns:
        - PIL Image объект QR кода
        - Base64 строка изображения QR
        - Уникальный код, который нужно связать с пользователем
    """
    
    # генерируем уникальный код на основе префикса партнера и типа аккаунта
    unique_code = generate_unique_qr_code(partner_prefix, account_type)

    # формируем URL с параметром
    url = f"{base_url}?ref={unique_code}"

    # создаем QR
    qr = qrcode.QRCode(
        version=2,
        error_correction=constants.ERROR_CORRECT_M,
        box_size=10,
        border=1,
    )
    
    qr.add_data(url)
    qr.make(fit=True)
    
    qr_image = qr.make_image(fill_color="black", back_color="white").get_image()
    
    # конвертируем в RGB для сохранения
    if qr_image.mode != 'RGB':
        qr_image = qr_image.convert('RGB')

    # преобразовываем в base64
    buffered = io.BytesIO()
    qr_image.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode()

    return qr_image, img_str, unique_code