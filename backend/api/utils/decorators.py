import logging
from functools import wraps
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ValidationError, PermissionDenied
from django.http import Http404
from rest_framework.exceptions import APIException
import traceback
from datetime import datetime

logger = logging.getLogger(__name__)

def handle_exceptions(func):
    """
    Обработчик ошибок для API endpoints
    Обрабатывает различные типы исключений и возвращает соответствующие HTTP статусы
    Текущие обрабоки:
    - Ошибки валидации - HTTP400
    - Объект не найден - HTTP404
    - Ошибки доступа - HTTP403
    - Обработки DRF исключений - вернется статус код от DRF
    - Необработанные исключения - HTTP500

    Автоматически выводит все ошибки в консоль с временной меткой.
    """
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except ValidationError as e:
            # ошибки валидации
            logger.error(f"\n[{datetime.now()}] VALIDATION ERROR in {func.__name__}:")
            logger.info(f"Error details: {e.messages if hasattr(e, 'messages') else str(e)}\n")
            return Response(
                {"error": 'Произошла ошибка валидации'},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Http404 as e:
            # объект не найден
            logger.error(f"\n[{datetime.now()}] NOT FOUND ERROR in {func.__name__}:")
            logger.info(f"Error details: {str(e) or 'Запрашиваемый ресурс не найден'}\n")
            return Response(
                {"error":  "Запрашиваемый ресурс не найден"},
                status=status.HTTP_404_NOT_FOUND
            )
        except PermissionDenied as e:
            # ошибки доступа
            logger.error(f"\n[{datetime.now()}] PERMISSION ERROR in {func.__name__}:")
            logger.info(f"Error details: {str(e) or 'У вас нет прав для выполнения этого действия'}\n")
            return Response(
                {"error": "У вас нет прав для выполнения этого действия"},
                status=status.HTTP_403_FORBIDDEN
            )
        except APIException as e:
            # обработка DRF исключений
            logger.error(f"\n[{datetime.now()}] API ERROR in {func.__name__}:")
            logger.info(f"Error details: {str(e)}")
            logger.info(f"Status code: {e.status_code}\n")
            return Response(
                {"error": f"Ошибка {e.status_code}"},
                status=e.status_code
            )
        except Exception as e:
            # необработанные исключения
            logger.error(f"\n[{datetime.now()}] UNHANDLED ERROR in {func.__name__}:")
            logger.info(f"Error type: {type(e).__name__}")
            logger.info(f"Error details: {str(e)}")
            logger.info("Traceback:")
            logger.info(traceback.format_exc())
           
            return Response(
                {
                    "error": "Произошла внутренняя ошибка сервера",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    return wrapper
