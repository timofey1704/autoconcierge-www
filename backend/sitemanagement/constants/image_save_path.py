def qr_upload_path(instance, filename):
    """Генерирует путь: media/register_qrcodes/{filename}"""
    return f"qrcodes/{filename}"