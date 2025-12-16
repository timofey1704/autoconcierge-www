from django import forms
from sitemanagement.models import Partner


class BatchQRCodeForm(forms.Form):
    partner = forms.ModelChoiceField(
        queryset=Partner.objects.all(),
        label='Партнер',
        help_text='Выберите партнера для генерации префикса QR кода',
        required=True
    )
    account_type = forms.ChoiceField(
        choices=[('L', 'Light'), ('M', 'Medium'), ('P', 'Premium')],
        label='Тарифный план',
        help_text='Тип тарифного плана (L/M/P) - влияет на генерацию кода',
        initial='L',
        required=True
    )
    amount = forms.IntegerField(
        min_value=1,
        max_value=100,
        label='Количество QR-кодов',
        help_text='Сколько QR-кодов создать (от 1 до 100)'
    )