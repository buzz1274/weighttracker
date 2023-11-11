from weights.models import Weight


class WeightHistory:
    def weight_history(self):
        return Weight.objects.raw(
            """
            SELECT w.id, weights.date,
                   weights.date_difference, w.weight,
                   last_week.last_week_date AS last_week_date,
                   last_week.weight AS last_week_weight,
                   TO_CHAR(float8 (w.weight - last_week.weight), 'FM0.00') AS change
            FROM (SELECT   w.date,
                           MIN(ABS((lw.date + 7) - w.date)) AS date_difference
                  FROM     weights_weight w
                  JOIN     weights_weight lw ON lw.user_id = w.user_id
                  WHERE    w.user_id = 1
                  GROUP BY w.date
                  ORDER BY w.date DESC, date_difference ASC
                  ) AS weights
            JOIN  weights_weight w ON (    w.user_id = 1
                                       AND w.date = weights.date)
            JOIN  (SELECT w.date, lw.weight, lw.date AS last_week_date,
                          ABS((lw.date + 7) - w.date) AS date_difference
                   FROM weights_weight w
                   JOIN weights_weight lw ON lw.user_id = w.user_id
                   WHERE w.user_id = 1
                   GROUP BY w.date, lw.weight, lw.date
                   ORDER BY w.date DESC, date_difference ASC
                  ) AS last_week ON (    last_week.date_difference = weights.date_difference
                                     AND w.date = last_week.date)
            ORDER BY weights.date DESC
            """
        )
