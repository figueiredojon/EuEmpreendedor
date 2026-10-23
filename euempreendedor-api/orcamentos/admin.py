from django.contrib import admin
from .models import Cliente, Orcamento, ItemOrcamento, NotaAtendimento

#TabularInline utilizado para edição de modelos relacionado com chave estrangeira diretamente,
#mesma página de administração do modelo principal. Serve para relacionamento 1:N ou N:N.

class ItemOrcamentoInline(admin.TabularInline):
    model = ItemOrcamento
    extra = 1
    
class OrcamentoAdmin(admin.ModelAdmin):
    inlines = [ItemOrcamentoInline]
    
# Register your models here.
admin.site.register(Cliente)
admin.site.register(Orcamento, OrcamentoAdmin)
admin.site.register(ItemOrcamento)
admin.site.register(NotaAtendimento)