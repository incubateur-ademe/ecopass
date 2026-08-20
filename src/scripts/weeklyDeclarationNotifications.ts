import "dotenv/config"
import { runWeeklyDeclarationNotifications } from "../services/cron/weeklyDeclarationNotifications"

const run = async () => {
  if (process.env.ENABLE_WEEKLY_DECLARATION_NOTIFICATIONS !== "true") {
    console.log("Weekly declaration notifications skipped")
    return
  }

  const result = await runWeeklyDeclarationNotifications(new Date())
  console.log(
    JSON.stringify(
      {
        message: "Weekly declaration notifications completed",
        periodStart: result.period.start.toISOString(),
        periodEnd: result.period.end.toISOString(),
        weeklyProducts: result.weeklyProducts,
        ownerAlerts: result.ownerAlerts,
        changedNotifications: result.changedNotifications,
      },
      null,
      2,
    ),
  )
}

run().catch((error) => {
  console.error("Weekly declaration notifications failed", error)
  process.exit(1)
})
