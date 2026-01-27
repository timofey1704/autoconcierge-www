from django.contrib import admin
from django.http import HttpResponseRedirect, HttpResponse
from django.template.response import TemplateResponse
from django.urls import path
from django.utils import timezone
from sitemanagement.models import *
from sitemanagement.forms.batchQRform import BatchQRCodeForm 

@admin.register(QRCode)
class QRCodeAdmin(admin.ModelAdmin):
    list_display = ("code", "partner", "account_type", "user", "is_printed_timestamp", "is_deployed_timestamp",  "is_selled_timestamp", "is_active_timestamp", "created_at")
    list_filter = ("partner", "account_type", "is_active", "is_deployed", "is_selled", "created_at", "is_printed")
    search_fields = ("code", "user__username", "partner__partner_name")
    readonly_fields = ("code", "image", "created_at", "user", "is_active", "is_printed", "is_deployed", "is_selled_timestamp", "is_active_timestamp", "active_before", "is_printed_timestamp", "is_deployed_timestamp", "selled_by", "status")
    actions = ['print_selected_qr_codes']
    change_list_template = 'admin/api/qrcode_changelist.html'
    
    def get_readonly_fields(self, request, obj=None):
        readonly_fields = list(self.readonly_fields)
        # если объект уже существует, делаем partner и account_type readonly
        if obj:
            readonly_fields.extend(['partner', 'account_type'])
        
        if obj:  # если объект уже существует
            is_customer_service = request.user.groups.filter(name='Customer Service').exists()
            
            if obj.is_printed:
                # если QR уже распечатан
                if is_customer_service:
                    # customer service не может менять is_printed обратно на False
                    readonly_fields.append('is_printed')
            else:
                # если QR не распечатан
                if not is_customer_service and not request.user.is_superuser:
                    # только customer service и суперпользователи могут менять is_printed на True
                    readonly_fields.append('is_printed')
                    
        return readonly_fields

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('batch-create/', self.admin_site.admin_view(self.batch_create_view), name='api_registerqrcode_batch-create'),
        ]
        return custom_urls + urls

    def batch_create_view(self, request):
        if request.method == 'POST':
            form = BatchQRCodeForm(request.POST)
            if form.is_valid():
                partner = form.cleaned_data['partner']
                account_type = form.cleaned_data['account_type']
                amount = form.cleaned_data['amount']
                created_count = 0
                errors = []
                
                for i in range(amount):
                    try:
                        QRCode.objects.create(
                            partner=partner,
                            account_type=account_type
                        )
                        created_count += 1
                    except Exception as e:
                        errors.append(f'QR #{i+1}: {str(e)}')
                        if len(errors) >= 5:  # показываем только первые 5 ошибок
                            errors.append(f'... и еще {amount - i - 1} ошибок')
                            break
                
                if created_count > 0:
                    self.message_user(
                        request, 
                        f'Успешно создано {created_count} QR-кодов для партнера "{partner.partner_name}" с тарифом "{account_type}"',
                        level='success'
                    )
                
                if errors:
                    self.message_user(
                        request,
                        f'Ошибки при создании: ' + '; '.join(errors[:5]),
                        level='error'
                    )
                
                return HttpResponseRedirect('../')
        else:
            form = BatchQRCodeForm()

        context = {
            'title': 'Создать QR-коды',
            'form': form,
            'opts': self.model._meta,
            **self.admin_site.each_context(request),
        }
        return TemplateResponse(request, 'admin/api/batch_create_form.html', context)

    def print_selected_qr_codes(self, request, queryset):
        # фильтруем только те объекты, у которых есть изображение и которые еще не распечатаны
        qr_codes_queryset = queryset.exclude(image__isnull=True).exclude(image='').filter(is_printed=False)
        
        if not qr_codes_queryset.exists():
            self.message_user(request, "Нет QR-кодов доступных для печати (QR коды должны иметь изображение и не быть распечатанными)", level='warning')
            return
        
        # ВАЖНО: сначала преобразуем в список, чтобы сохранить данные
        qr_codes_list = list(qr_codes_queryset)
        
        # отмечаем все выбранные QR коды как распечатанные
        now = timezone.now()
        qr_codes_queryset.update(is_printed=True, is_printed_timestamp=now)
        
        # создаем HTML страницу для печати
        html_content = """
        <!DOCTYPE html>
        <html>
        <head>
            <title>Печать QR-кодов</title>
            <style>
                @media print {{
                    body {{ margin: 0; padding: 20px; }}
                    .no-print {{ display: none; }}
                    .qr-container {{ 
                        page-break-inside: avoid; 
                    }}
                }}
                body {{
                    font-family: Arial, sans-serif;
                }}
                .qr-grid {{
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(210px, 210px));
                    gap: 20px;
                    padding: 20px;
                    justify-content: center;
                }}
                .qr-container {{ 
                    border: 1px solid #333;
                    border-radius: 8px;
                    padding: 5px;
                    text-align: center;
                    background: white;
                    box-shadow: 0 1px 5px rgba(0,0,0,0.1);
                }}
                .qr-image {{
                    display: block;
                    margin: 0 auto 5px;
                    width: 200px;
                    height: 200px;
                }}
                .qr-code-text {{
                    font-size: 16px;
                    font-weight: bold;
                    color: #333;
                    letter-spacing: 1px;
                    
                }}
                .print-header {{ 
                    text-align: center; 
                    margin-bottom: 30px;
                    padding: 20px;
                }}
                .print-header h1 {{
                    color: #333;
                    margin-bottom: 10px;
                }}
            </style>
        </head>
        <body>
            <div class="print-header no-print">
                <h1>QR-коды для печати</h1>
                <p>Всего кодов: {count}</p>
            </div>
            <div class="qr-grid">
        """.format(count=len(qr_codes_list))
        
        for qr_code in qr_codes_list:
            html_content += """
                <div class="qr-container">
                    <img src="{image_url}" class="qr-image" alt="QR код" />
                    <div class="qr-code-text">{code}</div>
                </div>
            """.format(
                code=qr_code.code,
                image_url=request.build_absolute_uri(qr_code.image.url)
            )
        
        html_content += """
            </div>
            <div class="no-print" style="text-align: center; margin: 30px;">
                <button onclick="window.print()" style="padding: 15px 25px; background: #417690; color: white; border: none; cursor: pointer; font-size: 16px;">
                    🖨️ Печать всех QR-кодов
                </button>
                <button onclick="window.location.href='/admin/sitemanagement/qrcode/'" style="padding: 15px 25px; background: #999; color: white; border: none; cursor: pointer; margin-left: 10px; font-size: 16px;">
                     Вернуться в админку
                </button>
            </div>
        </body>
        </html>
        """
        
        # создаем response с HTML содержимым
        response = HttpResponse(html_content)
        return response
    
    print_selected_qr_codes.short_description = "Распечатать выбранные QR-коды"


@admin.register(Partner)
class PartnerAdmin(admin.ModelAdmin):
    list_display = ("partner_name", "partner_prefix")
    list_filter = ("partner_name", "partner_prefix")
    search_fields = ("partner_name", "partner_prefix")
    readonly_fields = ("partner_prefix",)
    
@admin.register(Car)
class CarAdmin(admin.ModelAdmin):
    list_display = ("vin_code", "qr_code", "user")
    list_filter = ("user", )
    search_fields = ("vin_code", "qr_code", "user")
    
@admin.register(Membership)
class MembershipAdmin(admin.ModelAdmin):
    list_display = ("plan", "price")
    search_fields = ("plan", "price")
    list_filter = ("plan", "is_recommended")
    
@admin.register(Feature)
class FeatureAdmin(admin.ModelAdmin):
    list_display = ("name", )
    search_fields = ("name", )
    list_filter = ("name", )
    
@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ("title", )
    search_fields = ("name", )
    
@admin.register(Leads)
class LeadsAdmin(admin.ModelAdmin):
    list_display = ("phone_number", )
    readonly_fields = ("phone_number", )
    
@admin.register(Tranasctions)
class TransactionsAdmin(admin.ModelAdmin):
    list_display = ("user", "membership", "status")
    list_filter = ("membership", "status")
    search_fields = ("user", "membership")
