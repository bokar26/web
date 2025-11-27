export const metadata = {
  title: "Bugs - Admin",
}

export default function BugsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Bugs
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track user-reported bugs and issues
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
        <p className="text-gray-500 dark:text-gray-400">
          Bug tracking panel will be available here.
        </p>
      </div>
    </div>
  )
}

