from django.shortcuts import render, get_object_or_404
from django.utils import timezone

from .models import Cliente, Orcamento
from .serializers import ClienteSerializer, OrcamentoSerializer, OrcamentoPublicoSerializer, CadastroPublicoSerializer


from rest_framework import viewsets, status, generics #View para receber dados e criar um registro
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView #Classe base
from rest_framework.response import Response #Para devolver respostas JSON
from rest_framework.permissions import AllowAny #Permitir acesso sem login


#Ao invés de criar cada metodo para o CRUD, usar ModelViewSet para construir os metodos.

class ClienteViewSet(viewsets.ModelViewSet):
    serializer_class = ClienteSerializer
    permission_classes = [IsAuthenticated]

    #METODOS PARA ISOLAMENTO
    #O usuário só vê os clientes associados a ele.
    #Metodo GET
    def get_queryset(self):
        return Cliente.objects.filter(prestador=self.request.user)

    #POST - o cliente logado fica associado ao prestador logado.
    def perform_create(self, serializer):
        serializer.save(prestador=self.request.user)
        
class OrcamentoViewSet(viewsets.ModelViewSet):
    serializer_class = OrcamentoSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Orcamento.objects.filter(cliente__prestador = self.request.user)
        #Como o orçamento não tem um campo que o associe ao prestador, foi necessário usar o Lookup (__),
        #referênciar o cliente que está apontando para o prestador por meio da FK.
        
    def perform_create(self, serializer):
        serializer.save()
        
class AprovacaoPublicoView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, token):
        orcamento = get_object_or_404(Orcamento, token_aprovacao=token)
        serializer = OrcamentoPublicoSerializer(orcamento)
        return Response(serializer.data)
    
    def post(self, request, token):
        orcamento = get_object_or_404(Orcamento, token_aprovacao=token)
        decisao = request.data.get('decisao', '').upper()
        if decisao == 'APROVAR':
            orcamento.status = Orcamento.Status.APROVADO
        elif decisao == 'RECUSAR':
            orcamento.status = Orcamento.Status.RECUSADO
        else:
            return Response({'Erro':'Decisão Inválida, Clique em APROVAR ou RECUSAR'}, status=status.HTTP_400_BAD_REQUEST)
        
        orcamento.data_decisao = timezone.now().date()
        orcamento.save()
        return Response({
            'mensagem': f'Orçamento {orcamento.status} com sucesso',
            'status': orcamento.status
        }, status=status.HTTP_200_OK)
        
        
class CadastroUsuarioView(generics.CreateAPIView):
    serializer_class = CadastroPublicoSerializer
    permission_classes = [AllowAny]
    
    