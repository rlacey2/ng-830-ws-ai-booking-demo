import { Routes } from '@angular/router';
 
export const routes: Routes = [

        {
        path: '',
    //  path: 'booking',
        pathMatch: "full",
        loadComponent: () => import('./booking/booking').then(a => a.BookingComponent),
        title: 'Booking',
    },

];
