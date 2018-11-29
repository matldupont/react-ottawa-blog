import React from 'react'
import PropTypes from 'prop-types'
import { graphql, Link } from 'gatsby'
import Layout from '../components/Layout'

export default class IndexPage extends React.Component {
  getLatestMeetup() {
    const { data } = this.props
    const { edges: posts } = data.allMarkdownRemark

    if (posts.length === 0) return null;

    const post = posts[0].node;

    const postDate = new Date(post.frontmatter.date);
    console.log(postDate.getTime())
    if (postDate.getTime() < Date.now()) {
      return (
        <h1>No upcoming Meetups</h1>
      )
    }

    return [
      <h1 key="header">Out Next Meetup:</h1>,
      <div
        className="content"
        style={{ border: '1px solid #333', padding: '2em 4em' }}
        key={post.id}
      >
        <p>
          <Link className="has-text-primary" to={post.fields.slug}>
            {post.frontmatter.title}
          </Link>
          <span> &bull; </span>
          <small>{post.frontmatter.date}</small>
        </p>
        <p>
          {post.excerpt}
          <br />
          <br />
          <Link className="button is-small" to={post.fields.slug}>
            Keep Reading →
          </Link>
        </p>
      </div>
    ]
  }

  render() {
    return (
      <Layout>
        <section className="section">
          <div className="container">
            <div className="content">
              <h1 className="has-text-weight-bold is-size-2">A new way to manage ReactOttawa's site?</h1>
              {this.getLatestMeetup()}
            </div>
          </div>
        </section>
      </Layout>
    )
  }
}

IndexPage.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
}

export const pageQuery = graphql`
  query LatestMeetupQuery {
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] },
      filter: { frontmatter: { templateKey: { eq: "blog-post" } }},
    ) {
      edges {
        node {
          excerpt(pruneLength: 400)
          id
          fields {
            slug
          }
          frontmatter {
            title
            templateKey
            date(formatString: "MMMM DD, YYYY")
          }
        }
      }
    }
  }
`
