from datetime import date, timedelta

from model_bakery.recipe import Recipe, foreign_key, seq

from ..models.weight import Weight
from ..models.weight_user import WeightUser

user = Recipe(WeightUser, height_m=1.82, starting_weight_kg=100)

user_zero_height = Recipe(
    WeightUser,
    height_m=0,
)

bmi_weights = Recipe(
    Weight,
    user=foreign_key(user),
    date=seq(date(2023, 11, 28), timedelta(days=1)),
    weight_kg=seq(100, increment_by=-0.2),
)

bmi_weights_zero_height = Recipe(
    Weight,
    user=foreign_key(user_zero_height),
    date=seq(date(2023, 11, 28), timedelta(days=1)),
    weight_kg=seq(100, increment_by=-0.2),
)
