import HistoryList from "./_components/HistoryList";
import DoctorList from "./_components/DoctorList";
import AddNewSessionDialog from "./_components/AddNewSessionDialog";

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-extrabold text-3xl">My Dashboard</h2>
        <AddNewSessionDialog />
      </div>

      <HistoryList />

      <DoctorList />
    </div>
  );
};

export default Dashboard;
