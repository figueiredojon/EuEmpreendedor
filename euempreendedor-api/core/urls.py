from django.contrib import admin
from django.urls import path, include
from orcamentos.views import pagina_aprovacao_publica


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('orcamentos.urls')),
    path('orcamento/<uuid:token>/', pagina_aprovacao_publica, name='pagina-aprovacao-publica'),
    path('api-auth/', include('rest_framework.urls'))
]
