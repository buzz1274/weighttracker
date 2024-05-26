import calendar
from datetime import date, timedelta
from typing import Union


class Dates:
    DAYS_IN_WEEK = 7
    DAYS_IN_DECEMBER = 31
    LAST_MONTH_OF_YEAR = 12
    DAYS_IN_YEAR = 365

    def __init__(self, date_to_modify: Union[date, None] = None) -> None:
        if date_to_modify:
            self.date = date_to_modify
        else:
            self.date = date.today()

    def year_ago(self) -> Union[date, None]:
        """determine date for last year"""
        try:
            return self.date - timedelta(days=self.DAYS_IN_YEAR)
        except AttributeError:
            return None

    def month_ago(self) -> Union[date, None]:
        """determine date for last month"""
        try:
            if self.date.month == 1:
                return self.date.replace(
                    year=self.date.year - 1, month=self.LAST_MONTH_OF_YEAR
                )

            return self.date.replace(month=self.date.month - 1)
        except ValueError:
            return self.date.replace(
                month=self.date.month - 1,
                day=calendar.monthrange(year=self.date.year, month=self.date.month - 1)[
                    1
                ],
            )
        except AttributeError:
            return None

    def week_ago(self) -> Union[date, None]:
        """determine date for last week"""
        try:
            return self.date - timedelta(days=self.DAYS_IN_WEEK)
        except ValueError:
            return self.date.replace(
                year=self.date.year - 1,
                month=self.LAST_MONTH_OF_YEAR,
                day=(self.DAYS_IN_DECEMBER - (self.DAYS_IN_WEEK - self.date.day)),
            )
        except (AttributeError, TypeError):
            return None
