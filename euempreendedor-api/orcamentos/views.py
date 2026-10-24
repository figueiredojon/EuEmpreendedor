from django.shortcuts import render, get_object_or_404
from django.utils import timezone
from django.contrib.auth import authenticate

from .models import Cliente, Orcamento
from .serializers import ClienteSerializer, OrcamentoSerializer, OrcamentoPublicoSerializer, CadastroPublicoSerializer

from rest_framework import viewsets, status, generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token


class ClienteViewSet(viewsets.ModelViewSet):
    serializer_class = ClienteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Cliente.objects.filter(prestador=self.request.user)

    def perform_create(self, serializer):
        serializer.save(prestador=self.request.user)


class OrcamentoViewSet(viewsets.ModelViewSet):
    serializer_class = OrcamentoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Orcamento.objects.filter(cliente__prestador=self.request.user).order_by('-data_emissao', '-id')

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
            return Response({'Erro': 'Decisão Inválida, Clique em APROVAR ou RECUSAR'}, status=status.HTTP_400_BAD_REQUEST)

        orcamento.data_decisao = timezone.now().date()
        orcamento.save()
        return Response({
            'mensagem': f'Orçamento {orcamento.status} com sucesso',
            'status': orcamento.status
        }, status=status.HTTP_200_OK)


class CadastroUsuarioView(generics.CreateAPIView):
    serializer_class = CadastroPublicoSerializer
    permission_classes = [AllowAny]


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username', '').strip()
        password = request.data.get('password', '').strip()

        if not username or not password:
            return Response({'erro': 'Informe usuário e senha.'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)
        if not user:
            return Response({'erro': 'Usuário ou senha incorretos.'}, status=status.HTTP_401_UNAUTHORIZED)

        token, _ = Token.objects.get_or_create(user=user)
        nome = user.get_full_name().strip() or user.username

        return Response({
            'token': token.key,
            'user_id': user.id,
            'username': user.username,
            'nome': nome,
            'email': user.email
        }, status=status.HTTP_200_OK)


class PerfilView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        nome = user.get_full_name().strip() or user.username
        return Response({
            'user_id': user.id,
            'username': user.username,
            'nome': nome,
            'email': user.email
        }, status=status.HTTP_200_OK)
