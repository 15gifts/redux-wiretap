export default (defaultVars) => {
  let vars = defaultVars || {};

  return {
    getVars: () => vars,
    setVars: (newVars) => {
      vars = newVars || vars;

      return vars;
    },
  };
};
