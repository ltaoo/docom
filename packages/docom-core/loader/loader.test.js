const marktwain = require('mark-twain');

describe('markdown data', () => {
    it('marktwain', () => {
        const content = `
---
title: Button
subtitle: 按钮
---

这是按钮

<!--more-->

开始我们的正文内容`;

        const result = marktwain(content);

        expect(result).toEqual({
            meta: {},
            content: [
                'article',
                {
                    position: {
                        start: {
                            column: 1,
                            line: 2,
                            offset: 1,
                        },
                        end: {
                            column: 4,
                            line: 5,
                            offset: 35,
                        },
                        indent: [1, 1, 1],
                    },
                    type: 'yaml',
                    value: `title: Button
subtitle: 按钮`,
                },
                [
                    'p',
                    '这是按钮',
                ],
                [
                    '',
                ],
                [
                    'p',
                    '开始我们的正文内容',
                ],
            ],
        });
    });
});
