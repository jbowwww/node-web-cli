import _ from 'lodash';

const makeRef = () => _.assign(function _makeRef(el) { _makeRef.current = el; }, { current: null });

export default makeRef;
