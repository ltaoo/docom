import React from 'react';
import { getChildren } from 'jsonml.js/lib/utils';
import toReactComponent from 'jsonml-to-react-element';

import { withMarkdown } from '../utils';

function Home(props) {
    const { content } = props;
    return (
        <div className="main-container" style={{ marginTop: 40 }}>
            {toReactComponent(
                ['section', { className: 'markdown' }].concat(getChildren(content)),
            )}
        </div>
    );
}

export default withMarkdown(['index'])(Home);
