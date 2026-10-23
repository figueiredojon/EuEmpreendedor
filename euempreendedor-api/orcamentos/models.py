from django.db import models
from django.conf import settings
import uuid
from decimal import Decimal



# Models
class Cliente(models.Model):
    prestador = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='clientes')
    nome_cliente = models.CharField(max_length=200)
    telefone = models.CharField(max_length=20)
    
    cnpj_cpf = models.CharField(max_length=20, blank=True, default='')
    endereco = models.CharField(max_length=255, blank=True, default='')
    
    def __str__(self):
        return self.nome_cliente


class Orcamento(models.Model):
    class Status(models.TextChoices):
        PENDENTE = 'PENDENTE'
        APROVADO = 'APROVADO'
        RECUSADO = 'RECUSADO'
        
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name='orcamentos')
    numero = models.IntegerField()
    status = models.CharField(
        max_length=10,
        choices=Status.choices,
        default=Status.PENDENTE,
    )
    data_emissao = models.DateField(auto_now_add=True)
    validade = models.DateField(blank=True, null=True) #Aceita ficar branco na tela e grava null no banco
    data_decisao = models.DateField(blank=True, null=True) #Verifica a possibilidade de remover
    token_aprovacao = models.UUIDField(
        default=uuid.uuid4,
        editable=False,
        unique=True
    )
    
    @property
    def calcular_total(self):
        itensOrcamento = self.itens.exclude(removido=True)
        soma = Decimal('0.00')
        for item in itensOrcamento:
            soma = soma + item.valor
        return soma
            
        
class ItemOrcamento(models.Model):
    orcamento = models.ForeignKey(Orcamento, related_name='itens', on_delete=models.CASCADE)
    descricao = models.CharField(max_length=200)
    valor = models.DecimalField(max_digits=10,decimal_places=2)
    removido = models.BooleanField(default=False)
    
class NotaAtendimento(models.Model):
    orcamento = models.ForeignKey(Orcamento, related_name='notas', on_delete=models.CASCADE)
    texto = models.TextField()
    data_hora = models.DateTimeField(auto_now_add=True)
    
        