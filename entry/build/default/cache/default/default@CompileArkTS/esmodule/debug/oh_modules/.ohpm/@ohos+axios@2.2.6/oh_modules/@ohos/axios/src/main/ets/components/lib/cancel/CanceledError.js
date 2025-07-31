'use strict';

import AxiosError from '@normalized:N&&&@ohos/axios/src/main/ets/components/lib/core/AxiosError&2.2.6';
import utils from '@normalized:N&&&@ohos/axios/src/main/ets/components/lib/utils&2.2.6';

/**
 * A `CanceledError` is an object that is thrown when an operation is canceled.
 *
 * @param {string=} message The message.
 * @param {Object=} config The config.
 * @param {Object=} request The request.
 *
 * @returns {CanceledError} The created error.
 */
function CanceledError(message, config, request) {
  // eslint-disable-next-line no-eq-null,eqeqeq
  AxiosError.call(this, message == null ? 'canceled' : message, AxiosError.ERR_CANCELED, config, request);
  this.name = 'CanceledError';
}

utils.inherits(CanceledError, AxiosError, {
  __CANCEL__: true
});

export default CanceledError;
