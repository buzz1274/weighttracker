import decimal

from django.test import TestCase
from model_bakery import baker

from ..models import WeightUser


class WeightModelTestCase(TestCase):
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
