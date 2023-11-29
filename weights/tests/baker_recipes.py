from datetime import date, timedelta
from itertools import cycle

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

weight_dates = [
    date.today(),
    date(2000, 11, 5),
    date(2000, 11, 10),
    date(2000, 11, 11),
]
weights = Recipe(
    Weight,
    user=foreign_key(user),
    date=cycle(weight_dates),
    weight_kg=seq(100, increment_by=-0.5),
)
