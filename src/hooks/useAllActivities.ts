import { AppActions, useGlobalAppDispatch, useGlobalAppState } from '../store/AppProvider';
import { getActivities } from '../proxy/activity';
import { Activity } from '../domain/activity';

const useAllActivities = () => {
    const dispatch = useGlobalAppDispatch();
    const { actitivies: allActivities } = useGlobalAppState();

    const loadAllActivities = async () => {
        try {
            const activities = await getActivities();
            dispatch({ type: AppActions.SetActivities, payload: ((activities || []) as Activity[]).sort((a, b) => (a.name ?? '').localeCompare(b.name ?? '')) });
        } catch (error) {
            console.error('Failed to load activities:', error);
        }
    };
    return { allActivities, loadAllActivities }; // Replace with the desired return value of your hook
};

export default useAllActivities;