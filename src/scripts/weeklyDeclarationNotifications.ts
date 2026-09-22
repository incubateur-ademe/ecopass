import "dotenv/config"
import { runDailyDeclarationNotifications } from "../services/cron/dailyDeclarationNotifications"

const run = async () => {
  if (process.env.ENABLE_WEEKLY_DECLARATION_NOTIFICATIONS !== "true") {
    console.log("Weekly declaration notifications skipped")
    return
  }

  const result = await runDailyDeclarationNotifications(new Date())
  console.log(
    JSON.stringify(
      {
        message: "Weekly declaration notifications completed",
        periodStart: result.period.start.toISOString(),
        periodEnd: result.period.end.toISOString(),
        dailyProducts: result.dailyProducts,
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
