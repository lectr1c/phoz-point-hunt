CREATE VIEW "points_by_date" AS
SELECT
                  dates.d AS view_date,
                  u.team_id,
                  COALESCE(SUM(c.coupon_worth), 0) AS total_points_up_to_date
                FROM
                  (
                    SELECT
                      GENERATE_SERIES(
                        (
                          SELECT
                            MIN(added_at)
                          FROM
                            "phoz-point-hunt_points"
                        ),
                        (
                          SELECT
                            CURRENT_DATE + INTERVAL '1 day'
                        ),
                        '1 day'::INTERVAL
                      )::date AS d
                  ) dates
                  CROSS JOIN "phoz-point-hunt_users" u
                  LEFT JOIN "phoz-point-hunt_points" p ON p.user_id = u.id
                  LEFT JOIN "phoz-point-hunt_coupons" c ON c.id = p.coupon_id
                  AND p.added_at <= dates.d
                GROUP BY
                  dates.d,
                  u.team_id
                ORDER BY
                  dates.d,
                  u.team_id;