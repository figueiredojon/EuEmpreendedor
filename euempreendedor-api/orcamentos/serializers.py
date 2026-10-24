from rest_framework import serializers
from .models import Cliente, Orcamento, ItemOrcamento, NotaAtendimento
from django.db import transaction
from django.contrib.auth.models import User


class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = ['id', 'nome_cliente', 'telefone', 'cnpj_cpf', 'endereco']


class ItemOrcamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemOrcamento
        fields = ['id', 'descricao', 'valor', 'removido']


class NotaAtendimentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotaAtendimento
        fields = ['id', 'texto', 'data_hora']


class OrcamentoSerializer(serializers.ModelSerializer):
    itens = ItemOrcamentoSerializer(many=True, required=False)
    notas = NotaAtendimentoSerializer(many=True, read_only=True)
    nome_cliente = serializers.CharField(source='cliente.nome_cliente', read_only=True)

    class Meta:
        model = Orcamento
        fields = [
            'id', 
            'cliente',
            'nome_cliente',
            'numero', 
            'status', 
            'data_emissao', 
            'validade',
            'data_decisao',
            'token_aprovacao',
            'calcular_total',
            'itens',
            'notas'
        ]

    @transaction.atomic
    def create(self, validated_data):
        itens_data = validated_data.pop('itens', [])
        orcamento = Orcamento.objects.create(**validated_data)
        for item_data in itens_data:
            ItemOrcamento.objects.create(orcamento=orcamento, **item_data)
        return orcamento


class OrcamentoPublicoSerializer(serializers.ModelSerializer):
    itens = ItemOrcamentoSerializer(many=True, read_only=True)
    nome_cliente = serializers.CharField(source='cliente.nome_cliente', read_only=True)

    class Meta:
        model = Orcamento
        fields = [
            'numero',
            'nome_cliente',
            'status',
            'data_emissao',
            'validade',
            'calcular_total',
            'itens'
        ]


class CadastroPublicoSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'password'
        ]

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            password=validated_data['password']
        )
        return user
