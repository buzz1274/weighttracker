from datetime import date

from django.test import TestCase

from backend.weighttracker.helpers.dates import Dates


class DatesTestCase(TestCase):
    def test_years_ago_calculates_correctly(self):
        """test that month ago is calculated correctly"""
        self.assertEqual(
            Dates(date(year=2023, month=11, day=28)).year_ago(),
            date(year=2022, month=11, day=28),
        )

        self.assertEqual(Dates("x").year_ago(), None)

        self.assertEqual(Dates().year_ago(), Dates(date.today()).year_ago())

    def test_month_ago_calculates_correctly(self):
        """test that month ago is calculated correctly"""
        self.assertEqual(
            Dates(date(year=2023, month=11, day=28)).month_ago(),
            date(year=2023, month=10, day=28),
        )

        self.assertEqual(
            Dates(date(year=2023, month=1, day=28)).month_ago(),
            date(year=2022, month=12, day=28),
        )

        self.assertEqual(
            Dates(date(year=2023, month=3, day=31)).month_ago(),
            date(year=2023, month=2, day=28),
        )

        self.assertEqual(
            Dates(date(year=2023, month=10, day=31)).month_ago(),
            date(year=2023, month=9, day=30),
        )

        self.assertEqual(Dates("x").month_ago(), None)

        self.assertEqual(Dates().month_ago(), Dates(date.today()).month_ago())

    def test_week_ago_calculates_correctly(self):
        """test that week ago is calculated correctly"""
        self.assertEqual(
            Dates(date(year=2023, month=11, day=28)).week_ago(),
            date(year=2023, month=11, day=21),
        )

        self.assertEqual(
            Dates(date(year=2023, month=12, day=5)).week_ago(),
            date(year=2023, month=11, day=28),
        )

        self.assertEqual(
            Dates(date(year=2023, month=1, day=4)).week_ago(),
            date(year=2022, month=12, day=28),
        )

        self.assertEqual(Dates("x").week_ago(), None)

        self.assertEqual(Dates().week_ago(), Dates(date.today()).week_ago())
