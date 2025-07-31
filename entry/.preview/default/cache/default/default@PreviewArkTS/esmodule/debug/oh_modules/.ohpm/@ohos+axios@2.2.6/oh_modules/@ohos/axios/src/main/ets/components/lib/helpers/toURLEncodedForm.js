'use strict';

import utils from '@normalized:N&&&@ohos/axios/src/main/ets/components/lib/utils&2.2.6';
import toFormData from '@normalized:N&&&@ohos/axios/src/main/ets/components/lib/helpers/toFormData&2.2.6';
import platform from '@normalized:N&&&@ohos/axios/src/main/ets/components/lib/platform/index&2.2.6';

export default function toURLEncodedForm(data, options) {
  return toFormData(data, new platform.classes.URLSearchParams(), Object.assign({
    visitor: function(value, key, path, helpers) {
      if (platform.isNode && utils.isBuffer(value)) {
        this.append(key, value.toString('base64'));
        return false;
      }

      return helpers.defaultVisitor.apply(this, arguments);
    }
  }, options));
}
