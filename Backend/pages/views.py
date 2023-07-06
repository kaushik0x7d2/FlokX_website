from django.views.generic import TemplateView, View
from django.db.models import Sum
from .models import Loads, Agents,Buyers, Goats, Sellers, Payments_Buyer, Payments_Seller
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
import json
from django.core.mail import send_mail
from django.utils import timezone
from django_cron import CronJobBase, Schedule

from .models import Payments_Seller



 
class HomePageView(TemplateView):
    template_name = "pages/home.html"


class AboutPageView(TemplateView):
    template_name = "pages/about.html"

@method_decorator(csrf_exempt, name='dispatch')
class CreateLoadView(View):
    def post(self, request):
        # Retrieve the data from the request payload
        agent_id = request.POST.get('agent_id')
        load_id = request.POST.get('load_id')  
        # Retrieve other load-related data as needed

        try:
            # Check if the agent exists
            agent = Agents.objects.get(id=agent_id)

            # Create a new load with the provided load ID
            load = Loads(agent=agent, id=load_id) 
            # Set other load-related attributes here

            # Save the load to the database
            load.save()

            # Return a JSON response with a success message
            return JsonResponse({'message': 'Load created successfully.'})
        
        except Agents.DoesNotExist:
            # Return a JSON response with an error message if the agent does not exist
            return JsonResponse({'error': 'Agent does not exist.'}, status=400)



class DeleteLoadView(View):
    def delete(self, request, load_id):
        try:
            # Check if the load exists
            load = Loads.objects.get(id=load_id)

            # Delete the load
            load.delete()

            # Return a JSON response with a success message
            return JsonResponse({'message': 'Load deleted successfully.'})
        
        except Loads.DoesNotExist:
            # Return a JSON response with an error message if the load does not exist
            return JsonResponse({'error': 'Load does not exist.'}, status=400)


class MergeLoadsView(View):
    def post(self, request):
        # Retrieve the data from the request payload
        payload = json.loads(request.body)
        new_load_id = payload.get('new_load_id')
        agent_id = payload.get('agent_id')
        load_ids = payload.get('load_ids')

        try:
            # Check if the agent exists
            agent = Agents.objects.get(id=agent_id)

            # Create a new load with the provided load ID and agent ID
            new_load = Loads.objects.create(agent=agent, id=new_load_id)
            # Set other load-related attributes here

            for load_id in load_ids:
                # Retrieve the goats from each load to be merged
                goats_to_merge = Goats.objects.filter(load_id=load_id)

                # Assign the new load ID to the goats
                for goat in goats_to_merge:
                    goat.load = new_load
                    goat.save()

                # Delete the old load
                load_to_delete = Loads.objects.get(id=load_id)
                load_to_delete.delete()

            # Return a JSON response with a success message
            return JsonResponse({'message': 'Loads merged successfully.'})
        
        except Agents.DoesNotExist:
            # Return a JSON response with an error message if the agent does not exist
            return JsonResponse({'error': 'Agent does not exist.'}, status=400)



class SplitLoadView(View):
    def post(self, request):
        # Retrieve the load ID and goat IDs to be split from the request payload
        payload = json.loads(request.body)
        agent_id = payload.get('agent_id')
        goat_ids = payload.get('goat_ids')
        new_load_id = payload.get('new_load_id')
        load_id = payload.get('load_id')

        try:
            # Check if the agent exists
            agent = Agents.objects.get(id=agent_id)

            # Create a new load with the provided load ID and agent ID
            new_load = Loads.objects.create(agent=agent, id=new_load_id)
            
            # Assign the new load ID to the selected goats
            selected_goats = Goats.objects.filter(id__in=goat_ids)
            for goat in selected_goats:
                goat.load = new_load
                goat.save()

            # Return a JSON response with a success message
            return JsonResponse({'message': 'Load split successfully.'})
        
        except Agents.DoesNotExist:
            # Return a JSON response with an error message if the agent does not exist
            return JsonResponse({'error': 'Agent does not exist.'}, status=400)
        
        except Loads.DoesNotExist:
            # Return a JSON response with an error message if the load does not exist
            return JsonResponse({'error': 'Load does not exist.'}, status=400)


class CreateGoatView(View):
    def post(self, request):
        # Retrieve the data from the request payload
        load_id = request.POST.get('load_id')
        sex = request.POST.get('sex')
        weight = request.POST.get('weight')
        photo_url = request.POST.get('photo_url')

        try:
            # Check if the load exists
            load = Loads.objects.get(id=load_id)

            # Create a new goat
            goat = Goats(load=load, sex=sex, weight=weight, photo_url=photo_url)
            # Set other goat-related attributes here

            # Save the goat to the database
            goat.save()

            # Return a JSON response with a success message
            return JsonResponse({'message': 'Goat created successfully.'})
        
        except Loads.DoesNotExist:
            # Return a JSON response with an error message if the load does not exist
            return JsonResponse({'error': 'Load does not exist.'}, status=400)

class CreatePaymentsSellerView(View):
    def post(self, request):
        # Retrieve the data from the request payload
        agent_id = request.POST.get('agent_id')
        seller_id = request.POST.get('seller_id')
        load_id = request.POST.get('load_id')
        amount_due = request.POST.get('amount_due')
        due_date = request.POST.get('due_date')

        try:
            # Check if the agent, seller, and load exist
            agent = Agents.objects.get(id=agent_id)
            seller = Sellers.objects.get(id=seller_id)
            load = Loads.objects.get(id=load_id)

            # Create a new payment for the seller
            payment = Payments_Seller(agent=agent, seller=seller, load=load, amount_due=amount_due, due_date=due_date)
            # Set other payment-related attributes here

            # Save the payment to the database
            payment.save()

            # Return a JSON response with a success message
            return JsonResponse({'message': 'Payment created successfully.'})
        
        except (Agents.DoesNotExist, Sellers.DoesNotExist, Loads.DoesNotExist):
            # Return a JSON response with an error message if any of the agent, seller, or load does not exist
            return JsonResponse({'error': 'Agent, seller, or load does not exist.'}, status=400)


class CreatePaymentsBuyerView(View):
    def post(self, request):
        # Retrieve the data from the request payload
        agent_id = request.POST.get('agent_id')
        buyer_id = request.POST.get('buyer_id')
        load_id = request.POST.get('load_id')
        amount_due = request.POST.get('amount_due')
        due_date = request.POST.get('due_date')

        try:
            # Check if the agent, buyer, and load exist
            agent = Agents.objects.get(id=agent_id)
            buyer = Buyers.objects.get(id=buyer_id)
            load = Loads.objects.get(id=load_id)

            # Create a new payment for the buyer
            payment = Payments_Buyer(agent=agent, buyer=buyer, load=load, amount_due=amount_due, due_date=due_date)
            # Set other payment-related attributes here

            # Save the payment to the database
            payment.save()

            # Return a JSON response with a success message
            return JsonResponse({'message': 'Payment created successfully.'})
        
        except (Agents.DoesNotExist, Buyers.DoesNotExist, Loads.DoesNotExist):
            # Return a JSON response with an error message if any of the agent, buyer, or load does not exist
            return JsonResponse({'error': 'Agent, buyer, or load does not exist.'}, status=400)


class LoadDetailsView(View):
    def get(self, request):
        try:
            # Retrieve all loads
            loads = Loads.objects.all()

            # Initialize an empty list to store load details
            load_details_list = []

            for load in loads:
                # Retrieve the count of male and female goats in each load
                male_goats_count = Goats.objects.filter(load=load, sex='Male').count()
                female_goats_count = Goats.objects.filter(load=load, sex='Female').count()

                # Retrieve the agent's ID and name for the current load
                agent_id = load.agent_id
                agent_name = Agents.objects.filter(id=agent_id).values('name').first().get('name')

                # Calculate the total price of the load by summing the prices of all goats in the load
                total_price = Goats.objects.filter(load=load).aggregate(total_price=Sum('price')).get('total_price')

                # Prepare the load details
                load_details = {
                    'load_id': load.id,
                    'total_goats': load.goats_set.count(),
                    'created_at': load.created_at,
                    'male_goats': male_goats_count,
                    'female_goats': female_goats_count,
                    'agent_id': agent_id,
                    'agent_name': agent_name,
                    'total_price': total_price,
                }

                # Add the load details to the list
                load_details_list.append(load_details)

            # Return the load details list as a JSON response
            return JsonResponse(load_details_list, safe=False)
        
        except Loads.DoesNotExist:
            # Return a JSON response with an error message if no loads exist
            return JsonResponse({'error': 'No loads found.'}, status=400)



class PaymentsView(View):
    def get(self, request):
        # Retrieve the query parameters for agent_id (optional) and all_agents
        agent_id = request.GET.get('agent_id')
        all_agents = request.GET.get('all_agents')

        # Prepare the filter conditions based on the query parameters
        filter_conditions = {}

        if agent_id:
            filter_conditions['agent_id'] = agent_id

        if not all_agents:
            # Fetch payments only for the specified agent
            payments_seller = Payments_Seller.objects.filter(**filter_conditions)
            payments_buyer = Payments_Buyer.objects.filter(**filter_conditions)
        else:
            # Fetch payments for all agents
            payments_seller = Payments_Seller.objects.all()
            payments_buyer = Payments_Buyer.objects.all()

        # Prepare the response data
        response_data = {
            'payments_seller': list(payments_seller.values()),
            'payments_buyer': list(payments_buyer.values())
        }

        # Return the payments as JSON response
        return JsonResponse(response_data)


class AgentsListView(View):
    def get(self, request):
        agents = Agents.objects.all()
        agent_list = [
            {
                'id': agent.id,
                'name': agent.name,
                'address': agent.address,
                'contact_number': agent.contact_number
            }
            for agent in agents
        ]
        return JsonResponse(agent_list, safe=False)
    
class SellersListView(View):
    def get(self, request):
        sellers = Sellers.objects.all()
        seller_list = [
            {
                'id': seller.id,
                'name': seller.name,
                'address': seller.address,
                'contact_number': seller.contact_number
            }
            for seller in sellers
        ]
        return JsonResponse(seller_list, safe=False)
    
class BuyersListView(View):
    def get(self, request):
        buyers = Buyers.objects.all()
        buyer_list = [
            {
                'id': buyer.id,
                'name': buyer.name,
                'address': buyer.address,
                'contact_number': buyer.contact_number
            }
            for buyer in buyers
        ]
        return JsonResponse(buyer_list, safe=False)

class GoatDetailsView(View):
    def get(self, request, load_id):

        if load_id is None:
            return JsonResponse({'error': 'load_id parameter is required.'}, status=400)

        goats = Goats.objects.filter(load_id=load_id)
        goat_list = [
            {
                'id': goat.id,
                'sex': goat.sex,
                'weight': goat.weight,
                'photo_url': goat.photo_url
            }
            for goat in goats
        ]
        return JsonResponse(goat_list, safe=False)

class AllGoatDetailsView(View):
    def get(self, request):
    
        goats = Goats.objects.all()
        goat_list = [
            {
                'id': goat.id,
                'sex': goat.sex,
                'weight': goat.weight,
                'photo_url': goat.photo_url
            }
            for goat in goats
        ]
        return JsonResponse(goat_list, safe=False)
    
class PaymentsSellerListView(View):
    def get(self, request):
        payments_sellers = Payments_Seller.objects.all()
        payments_seller_list = [
            {
                'id': payments_seller.id,
                'agent': payments_seller.agent.name,
                'seller': payments_seller.seller.name,
                'amount_due': str(payments_seller.amount_due),
                'due_date': payments_seller.due_date.strftime('%Y-%m-%d'),
                'created_at': payments_seller.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                'modified_at': payments_seller.modified_at.strftime('%Y-%m-%d %H:%M:%S'),
            }
            for payments_seller in payments_sellers
        ]
        return JsonResponse(payments_seller_list, safe=False)
    
class PaymentsBuyerListView(View):
    def get(self, request):
        payments_buyers = Payments_Buyer.objects.all()
        payments_buyer_list = [
            {
                'id': payment.id,
                'agent': payment.agent.name,
                'buyer': payment.buyer.name,
                'sale_price': str(payment.sale_price),
                'amount_due': str(payment.amount_due),
                'due_date': payment.due_date.strftime('%Y-%m-%d') if payment.due_date is not None else None,
                'created_at': payment.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                'modified_at': payment.modified_at.strftime('%Y-%m-%d %H:%M:%S'),
            }
            for payment in payments_buyers
        ]
        return JsonResponse(payments_buyer_list, safe=False)




class CreateLoadAndGoatView(View):
    def post(self, request):
        # Retrieve the data from the request payload
        payload = json.loads(request.body)
        load_id = payload.get('load_id')
        agent_id = payload.get('agent_id')
        total_price = payload.get('total_price')
        goats = payload.get('goats')
        seller_id = payload.get('seller_id')
        amount_due = payload.get('amount_due')
        due_date = payload.get('due_date')

        try:
            # Check if the agent exists
            agent = Agents.objects.get(id=agent_id)

            # Create a new load with the provided load ID
            load = Loads(agent=agent, id=load_id)
            # Set other load-related attributes here

            # Save the load to the database
            load.save()

            # Calculate the total weight of all goats
            total_weight = sum(goat_data.get('weight') for goat_data in goats)

            # Retrieve the seller based on the seller_id
            seller = Sellers.objects.get(id=seller_id)

            # Create a new Payments_Seller object and save it to the database
            payment = Payments_Seller(agent=agent, seller=seller, amount_due=amount_due, due_date=due_date)
            payment.save()

            # Create goats and calculate the price based on the sum of weights
            for goat_data in goats:
                sex = goat_data.get('sex')
                weight = goat_data.get('weight')
                photo_url = goat_data.get('photo_url')

                # Calculate the price for the goat based on the sum of weights
                goat_price = (total_price / total_weight) * weight

                # Create a new goat
                goat = Goats(load=load, sex=sex, weight=weight, photo_url=photo_url, price=goat_price)
                # Set other goat-related attributes here

                # Save the goat to the database
                goat.save()

            # Return a JSON response with a success message
            return JsonResponse({'message': 'Load and goats created successfully.'})
        
        except Agents.DoesNotExist:
            # Return a JSON response with an error message if the agent does not exist
            return JsonResponse({'error': 'Agent does not exist.'}, status=400)
        except Sellers.DoesNotExist:
            # Return a JSON response with an error message if the seller does not exist
            return JsonResponse({'error': 'Seller does not exist.'}, status=400)



class CreatePaymentsSellerView(View):
    def post(self, request):
        # Get the input data from the request
        seller_id = request.POST.get('seller_id')
        agent_id = request.POST.get('agent_id')
        due_date = request.POST.get('due_date')
        amount_due = request.POST.get('amount_due')

        try:
            # Retrieve the Agent and Seller objects
            agent = Agents.objects.get(id=agent_id)
            seller = Sellers.objects.get(id=seller_id)

            # Create a new Payments_Seller object and save it to the database
            payment = Payments_Seller(agent=agent, seller=seller, amount_due=amount_due, due_date=due_date)
            payment.save()

            return JsonResponse({'message': 'Payment created successfully'})
        except Agents.DoesNotExist:
            return JsonResponse({'error': 'Agent not found'}, status=404)
        except Sellers.DoesNotExist:
            return JsonResponse({'error': 'Seller not found'}, status=404)

    def get(self, request):
        return JsonResponse({'error': 'Invalid request method'}, status=400)
    
class BuyGoatLoadView(View):
    def post(self, request):
        # Retrieve data from the request
        payload = json.loads(request.body)
        buyer_id = payload.get('buyer_id')
        agent_id = payload.get('agent_id')
        load_id = payload.get('load_id')
        sale_price = payload.get('sale_price')
        due_amount = payload.get('due_amount')

        # Update Payments_Buyer model
        payment = Payments_Buyer(
            agent_id=agent_id,
            buyer_id=buyer_id,
            sale_price=sale_price,
            amount_due=due_amount
        )
        payment.save()

        # Delete the load from Loads model
        Loads.objects.filter(id=load_id).delete()

        return JsonResponse({'message': 'Buyer payment and load deletion successful.'})
    
class ReminderEmailCronJob(CronJobBase):
    RUN_EVERY_MINS = 60  # Set the desired interval for running the cron job

    schedule = Schedule(run_every_mins=RUN_EVERY_MINS)
    code = 'your_app.reminder_email_cron_job'  # Set a unique code for the cron job

    def do(self):
        upcoming_payments = Payments_Seller.objects.filter(
            due_date__gte=timezone.now().date(),
        )

        for payment in upcoming_payments:
            agent_email = payment.agent.email
            # Send reminder email to the agent using `send_mail` function
            send_mail(
                'Payment Reminder',
                f'Dear Agent,\n\nThis is a reminder for the upcoming payment due on {payment.due_date}.\n\nSincerely, FlokX',
                'reminder@flokx.com',
                [agent_email],
            )