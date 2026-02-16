// @/components/bearfit/activity-log.tsx

interface ActivityLogProps {
  activity: any[];
}

export function ActivityLog({ activity }: ActivityLogProps) {
  return (
    <div className="space-y-4">
      {activity.map((a) => (
        <div
          key={a.id}
          className="bg-white p-4 rounded-lg shadow"
        >
          <p className="font-semibold">{a.title}</p>
          <p>{a.description}</p>
          <p className="text-sm text-gray-500">
            {new Date(a.activity_date).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
