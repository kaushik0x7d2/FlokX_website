from django.contrib import admin
from .models import Agents, Sellers, Buyers, Goats, Loads, Payments_Seller, Payments_Buyer

admin.site.register(Agents)
admin.site.register(Sellers)
admin.site.register(Buyers)
admin.site.register(Goats)
admin.site.register(Loads)
admin.site.register(Payments_Seller)
admin.site.register(Payments_Buyer)
