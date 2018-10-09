import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Endpoints, { globalCookiePolicy } from '../../../../Endpoints';

import {
  showSuccessNotification,
  showErrorNotification,
} from '../Notification';

class ResetMetadata extends Component {
  constructor() {
    super();
    this.state = {};
    this.state.isResetting = false;
  }

  render() {
    const styles = require('../PageContainer/PageContainer.scss');
    const metaDataStyles = require('./Metadata.scss');
    return (
      <div className={metaDataStyles.display_inline}>
        <button
          data-test="data-reset-metadata"
          className={styles.default_button + ' ' + metaDataStyles.margin_right}
          onClick={e => {
            e.preventDefault();
            const a = prompt(
              'Are you absolutely sure?\nThis action cannot be undone. This will permanently reset GraphQL Engine\'s configuration and you will need to start from scratch. Please type "RESET" (in caps, without quotes) to confirm.\n '
            );
            if (a.trim() !== 'RESET') {
              console.error('Did not reset metadata: User confirmation error');
              this.props.dispatch(
                showErrorNotification(
                  'Metadata reset failed',
                  'User confirmation error'
                )
              );
            } else {
              this.setState({ isResetting: true });
              const url = Endpoints.query;
              const requestBody = {
                type: 'clear_metadata',
                args: {},
              };
              const options = {
                method: 'POST',
                credentials: globalCookiePolicy,
                headers: {
                  ...this.props.dataHeaders,
                },
                body: JSON.stringify(requestBody),
              };
              fetch(url, options).then(response => {
                response.json().then(data => {
                  if (response.ok) {
                    this.setState({ isResetting: false });
                    this.props.dispatch(
                      showSuccessNotification('Metadata reset successfully!')
                    );
                  } else {
                    const parsedErrorMsg = data;
                    this.props.dispatch(
                      showErrorNotification(
                        'Metadata reset failed',
                        'Something went wrong.',
                        requestBody,
                        parsedErrorMsg
                      )
                    );
                    console.error('Error with response', parsedErrorMsg);
                    this.setState({ isResetting: false });
                  }
                });
              });
            }
          }}
        >
          {this.state.isResetting ? 'Resetting...' : 'Reset'}
        </button>
      </div>
    );
  }
}

ResetMetadata.propTypes = {
  dispatch: PropTypes.func.isRequired,
  dataHeaders: PropTypes.object.isRequired,
};

export default ResetMetadata;
