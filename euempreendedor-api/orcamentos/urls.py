from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    ClienteViewSet, 
    OrcamentoViewSet, 
    AprovacaoPublicoView, 
    CadastroUsuarioView,
    LoginView,
    PerfilView
)

router = DefaultRouter()
router.register('clientes', ClienteViewSet, 'cliente')
router.register('orcamentos', OrcamentoViewSet, 'orcamento')

urlpatterns = [
    path('login/', LoginView.as_view(), name='api-login'),
    path('perfil/', PerfilView.as_view(), name='api-perfil'),
    path('cadastro/', CadastroUsuarioView.as_view(), name='cadastro-usuario'),
    path('aprovacao/<uuid:token>/', AprovacaoPublicoView.as_view(), name='orcamento-aprovacao-publica'),
] + router.urls
