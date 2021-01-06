export const navbarToggler = (config = null) => {
  const { className, transformedClassName } = config;

  const navbarsCollection = Array.from(
    document.querySelectorAll('nav[data-toggleable=true]')
  );

  navbarsCollection.forEach(navbar => {
    const toggler = navbar.querySelector(`.${className.toggler}`);
    const hideable = navbar.querySelector(`.${className.navbar}`);
    const onToggle = () => {
      toggler.classList.toggle(transformedClassName.toggler);
      hideable.classList.toggle(transformedClassName.navbar);
    };

    toggler.addEventListener('click', onToggle);
  });
};
