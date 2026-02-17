function ActivityLog({ activities }: { activities: any[] }) {
  return (
    <div className="p-5 rounded-2xl shadow bg-white">
      <h3 className="font-semibold mb-2">Activity</h3>

      {activities.length === 0 && (
        <p className="text-sm text-gray-400">No activity yet</p>
      )}

      {activities.map((activity) => (
        <div key={activity.id} className="text-sm border-b py-2">
          <p className="font-medium">{activity.title}</p>
          <p className="text-gray-500">{activity.description}</p>
          <p className="text-xs text-gray-400">{new Date(activity.activity_date).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
