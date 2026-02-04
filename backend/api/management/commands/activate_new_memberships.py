from django.core.management.base import BaseCommand
from django.utils import timezone
from django.db import transaction

from sitemanagement.models import Tranasctions
from api.models import UserProfile


class Command(BaseCommand):
    help = 'Активация подписок для клиентов по успешным транзакциям'

    def handle(self, *args, **options):
        now = timezone.now()

        transactions = Tranasctions.objects.select_related(
            'user',
            'membership'
        ).filter(
            status='completed',
            subscription_start__isnull=False,
            subscription_start__lte=now,
        )

        activated_count = 0

        for trx in transactions:
            user = trx.user

            try:
                profile = user.userprofile
            except UserProfile.DoesNotExist:
                self.stdout.write(
                    self.style.WARNING(
                        f'⚠️ Пользователь {user.id} без профиля — пропущен'
                    )
                )
                continue

            # менеджеров пропускаем
            if profile.user_type != 'client':
                continue

            start = trx.subscription_start
            if not start:
                continue

            with transaction.atomic():
                # записываем тариф из транзакции
                profile.client_account_type = trx.membership.plan
                profile.save()

                activated_count += 1

                self.stdout.write(
                    self.style.SUCCESS(
                        f'✅ Подписка активирована: '
                        f'User={user.id}, '
                        f'Тариф={trx.membership.plan}, '
                        f'c {start.strftime("%d.%m.%Y %H:%M")}'
                    )
                )

        if activated_count == 0:
            self.stdout.write(
                self.style.SUCCESS('✅ Нет подписок для активации')
            )
        else:
            self.stdout.write(
                self.style.SUCCESS(
                    f'🎉 Всего активировано подписок: {activated_count}'
                )
            )