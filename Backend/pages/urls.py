from django.urls import path
from .views import CreateLoadView, CreateGoatView, CreatePaymentsSellerView, CreatePaymentsBuyerView, DeleteLoadView, MergeLoadsView, SplitLoadView, LoadDetailsView, PaymentsView, AgentsListView, CreateLoadAndGoatView
from .views import GoatDetailsView, CreatePaymentsSellerView
from .views import HomePageView, AboutPageView, SellersListView, PaymentsSellerListView, AllGoatDetailsView, BuyGoatLoadView
from .views import PaymentsBuyerListView, BuyersListView

urlpatterns = [
    path("", HomePageView.as_view(), name="home"),
    path("about/", AboutPageView.as_view(), name="about"),
    path('create-load/', CreateLoadView.as_view(), name='create-load'),
    path('delete-load/<int:load_id>/', DeleteLoadView.as_view(), name='delete-load'),
    path('merge-loads/', MergeLoadsView.as_view(), name='merge-loads'),
    path('split-load/', SplitLoadView.as_view(), name='split-load'),
    path('create-goat/', CreateGoatView.as_view(), name='create-goat'),
    path('create-payments-seller/', CreatePaymentsSellerView.as_view(), name='create-payments-seller'),
    path('create-payments-buyer/', CreatePaymentsBuyerView.as_view(), name='create-payments-buyer'),
    path('load-details/', LoadDetailsView.as_view(), name='load-details'),
    path('payments/', PaymentsView.as_view(), name='payments'),
    path('agents/', AgentsListView.as_view(), name='agents-list'),
    path('sellers/', SellersListView.as_view(), name='sellers-list'),
    path('buyers/', BuyersListView.as_view(), name='buyers-list'),
    path('goats/', AllGoatDetailsView.as_view(), name='all-goats'),
    path('paymentsseller/', PaymentsSellerListView.as_view(), name='payments-seller'),
    path('paymentsbuyer/', PaymentsBuyerListView.as_view(), name='payments-buyer'),
    path('buygoatload/', BuyGoatLoadView.as_view(), name='buy-goat-load'),
    path('Createlandg/',CreateLoadAndGoatView.as_view(), name='Createlandg'),
    path('goat-details/<int:load_id>/', GoatDetailsView.as_view(), name='goat-details'),
    path('createsellerpayments/', CreatePaymentsSellerView.as_view(), name='create_payments_seller')
]
