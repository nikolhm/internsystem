"""
WSGI config for cyb_oko project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.7/howto/deployment/wsgi/
"""

import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "cyb_oko.settings")

from django.core.wsgi import get_wsgi_application  # NOQA

application = get_wsgi_application()
