from channels.routing import ProtocolTypeRouter

from channels.routing import URLRouter
import apps.tasks.routing
from apps.tasks.ws_token import TokenAuthMiddleware

application = ProtocolTypeRouter(
    {
        # Empty for now (http->django views is added by default)
        "websocket": TokenAuthMiddleware(
            URLRouter(apps.tasks.routing.websocket_urlpatterns)
        )
        #'websocket':
        #        URLRouter(apps.tasks.routing.websocket_urlpatterns)
    }
)
