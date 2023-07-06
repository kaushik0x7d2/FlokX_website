from django.db import models

class Agents(models.Model):
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=200)
    contact_number = models.CharField(max_length=20)
    email = models.EmailField(max_length=254, null=True)

class Sellers(models.Model):
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=200)
    contact_number = models.CharField(max_length=20)
    email = models.EmailField(max_length=254, null=True)
    
class Buyers(models.Model):
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=200)
    contact_number = models.CharField(max_length=20)
    email = models.EmailField(max_length=254, null=True)

class Goats(models.Model):
    sex = models.CharField(max_length=10)
    weight = models.FloatField()
    photo_url = models.URLField()
    load = models.ForeignKey('Loads', on_delete=models.SET_NULL, null=True)
    price = models.FloatField(null=True)

class Loads(models.Model):
    agent = models.ForeignKey(Agents, on_delete=models.CASCADE)
    id = models.CharField(max_length=255, default='', primary_key=True)  
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

class Payments_Seller(models.Model):
    agent = models.ForeignKey(Agents, on_delete=models.CASCADE)
    seller = models.ForeignKey(Sellers, on_delete=models.CASCADE)
    amount_due = models.DecimalField(max_digits=10, decimal_places=2)
    due_date = models.DateField(null=True, default=None)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

class Payments_Buyer(models.Model):
    agent = models.ForeignKey(Agents, on_delete=models.CASCADE)
    buyer = models.ForeignKey(Buyers, on_delete=models.CASCADE)
    sale_price = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    amount_due = models.DecimalField(max_digits=10, decimal_places=2)
    due_date = models.DateField(null=True, default=None)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

