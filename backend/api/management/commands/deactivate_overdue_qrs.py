from django.core.management.base import BaseCommand
from django.utils import timezone
from sitemanagement.models import QRCode

class Command(BaseCommand):
    help = 'Деактивация QR кодов, которые не были активированы в течение 60 дней после продажи'

    def handle(self, *args, **options):
        
        # находим QR коды, которые:
        # 1. были проданы (is_selled=True)
        # 2. НЕ были активированы клиентом (is_active=False)
        # 3. истекло время активации (active_before < now)
        # 4. статус еще active
        
        qr_codes = QRCode.objects.filter(
            is_selled=True,
            is_active=False,
            active_before__lt=timezone.now(),
            status='active'
        )
        
        # получаем список кодов до обновления
        qr_list = list(qr_codes.values('code', 'is_selled_timestamp', 'active_before'))
        count = len(qr_list)
        
        if count > 0:
            # деактивируем QR коды
            qr_codes.update(status='deactivated')
            self.stdout.write(
                self.style.SUCCESS(
                    f'✅ Деактивировано {count} просроченных QR кодов'
                )
            )
            
            # выводим информацию о деактивированных кодах
            for qr in qr_list:
                self.stdout.write(
                    self.style.WARNING(
                        f'  - {qr["code"]} (продан: {qr["is_selled_timestamp"].strftime("%d.%m.%Y")}, '
                        f'истекает: {qr["active_before"].strftime("%d.%m.%Y")})'
                    )
                )
        else:
            self.stdout.write(
                self.style.SUCCESS('✅ Просроченных QR кодов не найдено')
            )