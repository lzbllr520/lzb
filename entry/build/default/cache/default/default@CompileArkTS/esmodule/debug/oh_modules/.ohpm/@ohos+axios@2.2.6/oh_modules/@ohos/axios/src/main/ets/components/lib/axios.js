'use strict';

import utils from '@normalized:N&&&@ohos/axios/src/main/ets/components/lib/utils&2.2.6';
import bind from '@normalized:N&&&@ohos/axios/src/main/ets/components/lib/helpers/bind&2.2.6';
import Axios from '@normalized:N&&&@ohos/axios/src/main/ets/components/lib/core/Axios&2.2.6';
import mergeConfig from '@normalized:N&&&@ohos/axios/src/main/ets/components/lib/core/mergeConfig&2.2.6';
import defaults from '@normalized:N&&&@ohos/axios/src/main/ets/components/lib/defaults/index&2.2.6';
import formDataToJSON from '@normalized:N&&&@ohos/axios/src/main/ets/components/lib/helpers/formDataToJSON&2.2.6';
import CanceledError from '@normalized:N&&&@ohos/axios/src/main/ets/components/lib/cancel/CanceledError&2.2.6';
import CancelToken from '@normalized:N&&&@ohos/axios/src/main/ets/components/lib/cancel/CancelToken&2.2.6';
import isCancel from '@normalized:N&&&@ohos/axios/src/main/ets/components/lib/cancel/isCancel&2.2.6';
import {VERSION} from '@normalized:N&&&@ohos/axios/src/main/ets/components/lib/env/data&2.2.6';
import toFormData from '@normalized:N&&&@ohos/axios/src/main/ets/components/lib/helpers/toFormData&2.2.6';
import AxiosError from '@normalized:N&&&@ohos/axios/src/main/ets/components/lib/core/AxiosError&2.2.6';
import spread from '@normalized:N&&&@ohos/axios/src/main/ets/components/lib/helpers/spread&2.2.6';
import isAxiosError from '@normalized:N&&&@ohos/axios/src/main/ets/components/lib/helpers/isAxiosError&2.2.6';
import AxiosHeaders from "@normalized:N&&&@ohos/axios/src/main/ets/components/lib/core/AxiosHeaders&2.2.6";
import HttpStatusCode from '@normalized:N&&&@ohos/axios/src/main/ets/components/lib/helpers/HttpStatusCode&2.2.6';
import FormData from '@normalized:N&&&@ohos/axios/src/main/ets/components/lib/env/classes/FormData&2.2.6'

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 *
 * @returns {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  const context = new Axios(defaultConfig);
  const instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context, {allOwnKeys: true});

  // Copy context to instance
  utils.extend(instance, context, null, {allOwnKeys: true});

  // Factory for creating new instances
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };

  return instance;
}

// Create the default instance to be exported
const axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Expose Cancel & CancelToken
axios.CanceledError = CanceledError;
axios.CancelToken = CancelToken;
axios.isCancel = isCancel;
axios.VERSION = VERSION;
axios.toFormData = toFormData;

// Expose AxiosError class
axios.AxiosError = AxiosError;

// alias for CanceledError for backward compatibility
axios.Cancel = axios.CanceledError;

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};

axios.spread = spread;

// Expose isAxiosError
axios.isAxiosError = isAxiosError;

// Expose mergeConfig
axios.mergeConfig = mergeConfig;

axios.AxiosHeaders = AxiosHeaders;

axios.formToJSON = thing => formDataToJSON(utils.isHTMLForm(thing) ? new FormData(thing) : thing);

axios.HttpStatusCode = HttpStatusCode;

axios.default = axios;

axios.FormData = FormData

// this module should only have a default export
export default axios
