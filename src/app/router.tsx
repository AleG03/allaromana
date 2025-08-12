import { createBrowserRouter } from 'react-router-dom';
import Home from '@/pages/Home';
import GroupView from '@/pages/GroupView';
import ExpenseAdd from '@/pages/ExpenseAdd';
import ExpenseEdit from '@/pages/ExpenseEdit';
import SettlementForm from '@/pages/SettlementForm';

export const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/group/:groupId', element: <GroupView /> },
  { path: '/group/:groupId/add', element: <ExpenseAdd /> },
  { path: '/group/:groupId/edit/:expenseId', element: <ExpenseEdit /> },
  { path: '/group/:groupId/settle', element: <SettlementForm /> },
]);