from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import ClienteViewSet, OrcamentoViewSet, AprovacaoPublicoView, CadastroUsuarioView

#Utilizando o DefaultRouter somente para os ModelViewSet
#Path utilizando para criar a rota para a APIView.
router = DefaultRouter()

router.register('clientes', ClienteViewSet, 'cliente')
router.register('orcamentos', OrcamentoViewSet, 'orcamento')


urlpatterns = [
    path('aprovacao/<uuid:token>/', AprovacaoPublicoView.as_view(), name='orcamento-aprovacao-publica'),
    path('cadastro/', CadastroUsuarioView.as_view(), name='cadastro-usuario'),
] + router.urls

