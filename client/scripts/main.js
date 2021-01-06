import { navbarToggler } from './navbar';

navbarToggler({
  className: {
    toggler: 'nav-main__toggler',
    navbar: 'nav-main__inner'
  },
  transformedClassName: {
    toggler: 'nav-main__toggler--opened',
    navbar: 'nav-main__inner--opened'
  }
});
