import decimal
from datetime import date

from django.test import TestCase
from model_bakery import baker

from ..models.weight_user import WeightUser


class WeightUserModelTestCase(TestCase):
    def test_bmi_returns_correct_value(self) -> None:
        bmi_weights = baker.make_recipe(
            "weights.tests.bmi_weights", _quantity=1
        )

        user = WeightUser.objects.filter(pk=bmi_weights[0].user_id).get()
        bmi = user.bmi()

        self.assertEqual(type(bmi), decimal.Decimal)
        self.assertEqual(f"{bmi:.2f}", f"{decimal.Decimal(30.19):.2f}")

    def test_bmi_returns_negative_value_if_negative_height(self) -> None:
        bmi_weights_zero_height = baker.make_recipe(
            "weights.tests.bmi_weights_zero_height", _quantity=1
        )

        user_zero_height = WeightUser.objects.filter(
            pk=bmi_weights_zero_height[0].user_id
        ).get()
        bmi = user_zero_height.bmi()

        self.assertIs(bmi, None)

    def test_bmi_no_weight_returns_none(self):
        bmi_user_no_weights = baker.make_recipe("weights.tests.user")
        self.assertIs(bmi_user_no_weights.bmi(), None)

    def test_bmi_boundaries(self):
        bmi_weights = baker.make_recipe(
            "weights.tests.bmi_weights", _quantity=1
        )
        user = WeightUser.objects.filter(pk=bmi_weights[0].user_id).get()

        self.assertEqual(
            user.bmi_boundaries(),
            {
                "obese": decimal.Decimal("99.4"),
                "overweight": decimal.Decimal("82.8"),
                "normal": decimal.Decimal("61.3"),
            },
        )

    def test_weight_at_date_returns_correctly(self):
        bmi_weights = baker.make_recipe("weights.tests.weights", _quantity=2)

        user = WeightUser.objects.filter(pk=bmi_weights[0].user_id).get()

        self.assertEqual(user.weight_at_date().weight_kg, 100)

        self.assertEqual(user.weight_at_date(date(2000, 11, 5)).weight_kg, 99)
        self.assertIs(user.weight_at_date(date(2019, 1, 1)), None)

    def test_change_between_dates_returns_correct_values(self):
        weights = baker.make_recipe("weights.tests.weights", _quantity=4)

        user = WeightUser.objects.filter(pk=weights[0].user_id).get()

        self.assertEqual(
            user.change_between_dates(date(2000, 11, 5), date(2000, 11, 11)),
            decimal.Decimal(-1.00),
        )

        self.assertIs(
            user.change_between_dates(date(2000, 11, 6), date(2000, 11, 11)),
            None,
        )

        self.assertIs(
            user.change_between_dates(date(2000, 11, 5), date(2000, 11, 12)),
            None,
        )
