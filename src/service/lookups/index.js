import {
    LIST_STUDENTS_URL,
    LIST_STAFFS_URL,
    LIST_SCHOOLS_URL,
    LIST_PARENTS_URL,
    LIST_CANTEEN_ITEMS_URL,
    ACTIVE_SESSION_URL,
} from '../../constant';
import { getRequest } from '../calls';

/**
 * Reference lists used to populate dropdowns.
 *
 * These used to be raw `axios.get(API_BASE + '/list/...')` calls scattered across
 * page components, which meant a 403 failed silently (only a console.error) and
 * the endpoints could not be swapped in one place.
 *
 * FE-08 audit of BE-03 (/list/* is admin-only). Every caller below now sits on an
 * admin-only route, so the role matches the endpoint and no call needs a
 * workaround:
 *   - LIST_STUDENTS_URL  -> ParentPage, ParentDetailsPage, CardPage   (admin)
 *   - LIST_PARENTS_URL   -> StudentPage, StudentDetailsPage          (admin)
 *   - LIST_SCHOOLS_URL   -> StaffPage, StaffDetailsPage, AdminDetailsPage (admin)
 *   - LIST_STAFFS_URL    -> CardPage                                  (admin)
 *   - LIST_CANTEEN_ITEMS_URL -> SessionPage                            (operator!)
 *
 * The canteen item list is the one mismatch: an operator opens the session page
 * and cannot read /list/canteen-items, so the item dropdown stays empty. This is
 * NOT worked around in the UI. SessionPage shows the 403 inline and a scoped
 * canteen-items endpoint for operators is requested from Ahmed (BE-03 follow-up).
 */

export const doListStudents = (token) => getRequest(token, LIST_STUDENTS_URL);
export const doListStaffs = (token) => getRequest(token, LIST_STAFFS_URL);
export const doListSchools = (token) => getRequest(token, LIST_SCHOOLS_URL);
export const doListParents = (token) => getRequest(token, LIST_PARENTS_URL);
export const doListCanteenItems = (token) => getRequest(token, LIST_CANTEEN_ITEMS_URL);

// Currently open session for the day, or null. Not a reference list, but read
// the same way from a page component.
export const doActiveSession = (token) => getRequest(token, ACTIVE_SESSION_URL);
